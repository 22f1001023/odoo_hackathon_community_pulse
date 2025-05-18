from flask import Flask
from flask_security import Security, SQLAlchemyUserDatastore
from flask_security.utils import hash_password
from Backend.models import *
from Backend.config import LocalDevelopmentConfig

def create_app():
    app = Flask(__name__, template_folder='Frontend', static_folder='Frontend/static')
    app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    user_datastore = SQLAlchemyUserDatastore(db, User, Role)
    Security(app, user_datastore)
    # Register your blueprint here
    from Backend.routes import bp
    app.register_blueprint(bp)
    return app



def seed_admin_and_user(app):
    with app.app_context():
        db.create_all()
        user_datastore = SQLAlchemyUserDatastore(db, User, Role)

        # Create admin role if it doesn't exist
        if not user_datastore.find_role('admin'):
            user_datastore.create_role(name='admin', description='Administrator')
            db.session.commit()

        # Create admin user if not exists
        if not user_datastore.find_user(email='admin@communitypulse.com'):
            admin_user = user_datastore.create_user(
                username='admin',
                email='admin@communitypulse.com',
                phone='1234567890',
                password=hash_password('adminpassword'),  # Change this password!
                active=True
            )
            admin_role = user_datastore.find_role('admin')
            user_datastore.add_role_to_user(admin_user, admin_role)
            db.session.commit()
            print('Admin user created.')
        else:
            print('Admin user already exists.')

        # Create test user if not exists
        if not user_datastore.find_user(email='user@communitypulse.com'):
            user_datastore.create_user(
                username='testuser',
                email='user@communitypulse.com',
                phone='9876543210',
                password=hash_password('userpassword'),
                active=True
            )
            db.session.commit()
            print('Test user created.')
        else:
            print('Test user already exists.')

app = create_app()
seed_admin_and_user(app)

# Import your routes after app and db are set up
import Backend.routes  # Adjust this import if routes.py is in a subfolder

if __name__ == '__main__':
    app.run(debug=True)
