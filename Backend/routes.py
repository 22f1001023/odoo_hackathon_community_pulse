from flask import Blueprint, jsonify, request, render_template, flash
from flask import current_app as app, jsonify, request, render_template, redirect, url_for, flash
from flask_security.utils import verify_password, login_user, hash_password, logout_user
from flask_security import auth_required, roles_required, current_user
from Backend.models import *
from uuid import uuid4
from datetime import datetime

bp = Blueprint('main', __name__)
# --------- AUTH ROUTES ---------

@bp.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    if not all([username, email, phone, password, confirm_password]):
        return jsonify({"error": "All fields are required"}), 400
    if password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already taken"}), 400

    new_user = User(
        username=username,
        email=email,
        phone=phone,
        password=hash_password(password),
        active=True,
        fs_uniquifier=uuid4().hex
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Registration successful! You can now log in."}), 201

@bp.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    user = User.query.filter_by(email=email).first()
    if not user or not verify_password(password, user.password):
        return jsonify({"error": "Invalid credentials"}), 401
    if user.is_banned:
        return jsonify({"error": "Your account has been banned."}), 403
    if not user.active:
        return jsonify({"error": "Your account is not active."}), 403
    login_user(user)
    # Determine redirect URL based on role
    role = user.roles[0].name if user.roles else None
    if role == 'admin':
        redirect_url = '/admin/dashboard'
    else:
        redirect_url = '/dashboard'
    return jsonify({
        "message": "Login successful",
        "role": role,
        "user_id": user.id,
        "redirect_url": redirect_url
    }), 200

@bp.route('/api/auth/logout', methods=['POST'])
@auth_required('session')
def logout():
    logout_user()
    return jsonify({"message": "Logout successful"}), 200

# --------- EVENT ROUTES ---------

@bp.route('/api/events', methods=['GET'])
def get_events():
    # Public: List all approved events
    events = Event.query.filter_by(is_approved=True, is_cancelled=False).all()
    result = []
    for event in events:
        result.append({
            "id": event.id,
            "name": event.name,
            "description": event.description,
            "start_date": event.start_date,
            "end_date": event.end_date,
            "address": event.address,
            "city": event.city,
            "pincode": event.pincode,
            "photo": event.photo,
            "category": event.category.name if event.category else None,
            "creator": event.creator.username if event.creator else None
        })
    return jsonify(result)

@bp.route('/api/events', methods=['POST'])
@auth_required('session')
def create_event():
    data = request.form
    name = data.get('name')
    description = data.get('description')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    registration_start = data.get('registration_start')
    registration_end = data.get('registration_end')
    address = data.get('address')
    city = data.get('city')
    pincode = data.get('pincode')
    category_id = data.get('category_id')

    # Handle file upload
    photo = None
    if 'photo' in request.files:
        file = request.files['photo']
        filename = f"{uuid4().hex}_{file.filename}"
        file.save(f"Frontend/static/uploads/{filename}")
        photo = filename

    event = Event(
        name=name,
        description=description,
        start_date=datetime.strptime(start_date, "%Y-%m-%dT%H:%M"),
        end_date=datetime.strptime(end_date, "%Y-%m-%dT%H:%M"),
        registration_start=datetime.strptime(registration_start, "%Y-%m-%dT%H:%M"),
        registration_end=datetime.strptime(registration_end, "%Y-%m-%dT%H:%M"),
        address=address,
        city=city,
        pincode=pincode,
        photo=photo,
        creator_id=current_user.id,
        category_id=category_id,
        is_approved=False
    )
    db.session.add(event)
    db.session.commit()
    return jsonify({"message": "Event submitted for approval."}), 201

@bp.route('/api/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    event = Event.query.get_or_404(event_id)
    if not event.is_approved or event.is_cancelled:
        return jsonify({"error": "Event not found"}), 404
    return jsonify({
        "id": event.id,
        "name": event.name,
        "description": event.description,
        "start_date": event.start_date,
        "end_date": event.end_date,
        "address": event.address,
        "city": event.city,
        "pincode": event.pincode,
        "photo": event.photo,
        "category": event.category.name if event.category else None,
        "creator": event.creator.username if event.creator else None
    })

@bp.route('/api/events/<int:event_id>', methods=['PUT'])
@auth_required('session')
def edit_event(event_id):
    event = Event.query.get_or_404(event_id)
    if event.creator_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403
    data = request.get_json()
    for field in ['name', 'description', 'start_date', 'end_date', 'registration_start', 'registration_end', 'address', 'city', 'pincode', 'category_id']:
        if field in data:
            setattr(event, field, data[field])
    db.session.commit()
    return jsonify({"message": "Event updated successfully."})

@bp.route('/api/events/<int:event_id>', methods=['DELETE'])
@auth_required('session')
def delete_event(event_id):
    event = Event.query.get_or_404(event_id)
    if event.creator_id != current_user.id:
        return jsonify({"error": "Unauthorized"}), 403
    db.session.delete(event)
    db.session.commit()
    return jsonify({"message": "Event deleted."})

# --------- EVENT REGISTRATION (USER INTEREST) ---------

@bp.route('/api/events/<int:event_id>/register', methods=['POST'])
def register_for_event(event_id):
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    num_people = data.get('num_people', 1)
    event = Event.query.get_or_404(event_id)
    if not event.is_approved or event.is_cancelled:
        return jsonify({"error": "Event not found"}), 404
    reg = EventRegistration(
        event_id=event_id,
        name=name,
        email=email,
        phone=phone,
        num_people=num_people,
        registered_at=datetime.utcnow()
    )
    db.session.add(reg)
    db.session.commit()
    return jsonify({"message": "Registered for event."}), 201

# --------- ADMIN ROUTES (EXAMPLES) ---------

@bp.route('/api/admin/events/pending', methods=['GET'])
@auth_required('session')
@roles_required('admin')
def pending_events():
    events = Event.query.filter_by(is_approved=False).all()
    result = [{
        "id": event.id,
        "name": event.name,
        "creator": event.creator.username if event.creator else None
    } for event in events]
    return jsonify(result)

@bp.route('/api/admin/events/<int:event_id>/approve', methods=['POST'])
@auth_required('session')
@roles_required('admin')
def approve_event(event_id):
    event = Event.query.get_or_404(event_id)
    event.is_approved = True
    db.session.commit()
    return jsonify({"message": "Event approved."})

@bp.route('/api/admin/events/<int:event_id>/reject', methods=['POST'])
@auth_required('session')
@roles_required('admin')
def reject_event(event_id):
    event = Event.query.get_or_404(event_id)
    db.session.delete(event)
    db.session.commit()
    return jsonify({"message": "Event rejected and deleted."})

@bp.route('/api/admin/users/<int:user_id>/ban', methods=['POST'])
@auth_required('session')
@roles_required('admin')
def ban_user(user_id):
    user = User.query.get_or_404(user_id)
    user.is_banned = True
    db.session.commit()
    return jsonify({"message": "User banned."})

@bp.route('/api/admin/categories', methods=['POST'])
@auth_required('session')
@roles_required('admin')
def add_category():
    data = request.get_json()
    name = data.get('name')
    if not name:
        return jsonify({"error": "Category name required"}), 400
    if Category.query.filter_by(name=name).first():
        return jsonify({"error": "Category already exists"}), 400
    category = Category(name=name, created_by=current_user.id)
    db.session.add(category)
    db.session.commit()
    return jsonify({"message": "Category added."}), 201

@bp.route('/api/categories', methods=['GET'])
def get_categories():
    cats = Category.query.all()
    return jsonify([{"id": c.id, "name": c.name} for c in cats])

# --------- USER PROFILE ROUTES ---------

@bp.route('/api/profile', methods=['GET'])
@auth_required('session')
def get_profile():
    user = current_user
    return jsonify({
        "username": user.username,
        "email": user.email,
        "phone": user.phone
    }), 200

@bp.route('/api/profile', methods=['PUT','PATCH'])
@auth_required('session')
def update_profile():
    user = current_user
    data = request.get_json()
    updated = False

    # Update username
    new_username = data.get('username')
    if new_username and new_username != user.username:
        # Check if username is taken
        if User.query.filter_by(username=new_username).first():
            return jsonify({"error": "Username already taken"}), 400
        user.username = new_username
        updated = True

    # Update phone
    new_phone = data.get('phone')
    if new_phone and new_phone != user.phone:
        user.phone = new_phone
        updated = True

    # Update password
    current_password = data.get('current_password')
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')
    if new_password or confirm_password:
        if not current_password or not verify_password(current_password, user.password):
            return jsonify({"error": "Current password is incorrect"}), 400
        if new_password != confirm_password:
            return jsonify({"error": "New passwords do not match"}), 400
        user.password = hash_password(new_password)
        updated = True

    if updated:
        db.session.commit()
        return jsonify({"message": "Profile updated successfully"}), 200
    else:
        return jsonify({"message": "No changes made"}), 200


# --------- HOME ROUTE (RENDER MAIN PAGE) ---------

@bp.route('/', defaults={'path': ''})
@bp.route('/')
def catch_all(path=''):
    return render_template("index.html")


