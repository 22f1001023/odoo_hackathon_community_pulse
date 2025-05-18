import os

class Config:
    DEBUG = False
    TESTING = False
    SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")  # Always set a strong key in production!
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Should be False for performance
    WTF_CSRF_ENABLED = True  # Enable CSRF protection for forms
    SECURITY_PASSWORD_HASH = "bcrypt"
    SECURITY_PASSWORD_SALT = os.getenv("SECURITY_PASSWORD_SALT", "supersecretsalt")
    CELERY_BROKER_URL = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND = "redis://localhost:6379/0"
    UPLOAD_FOLDER = os.path.join(os.path.abspath(os.path.dirname(__file__)), "static", "uploads")
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # Limit upload size to 16MB
    # Email/SMS/WhatsApp notification settings (add as needed for your provider)
    # MAIL_SERVER = "smtp.example.com"
    # MAIL_PORT = 587
    # MAIL_USE_TLS = True
    # MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    # MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")

class LocalDevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///database.sqlite3"
    WTF_CSRF_ENABLED = False  # For local testing only; enable in production!
