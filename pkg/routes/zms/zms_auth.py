from flask import render_template, request, redirect, url_for, flash, session
from . import zms_bp 
from pkg.models import db, BusinessOwner, Client 
from werkzeug.security import generate_password_hash, check_password_hash


@zms_bp.route('/auth/business/signup', methods=['POST'])
def business_signup():
    if request.method == 'POST':
        business_name = request.form.get('business_name')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')

        if not all([business_name, email, password, confirm_password]):
            flash('All fields are required.', 'error')
            return redirect(url_for('zms.zms_index', _anchor='authModal', modal_tab='businessOwnerTab', modal_form='boSignup'))

        if password != confirm_password:
            flash('Passwords do not match.', 'error')
            return redirect(url_for('zms.zms_index', _anchor='authModal', modal_tab='businessOwnerTab', modal_form='boSignup'))

        if len(password) < 8:
            flash('Password must be at least 8 characters long.', 'error')
            return redirect(url_for('zms.zms_index', _anchor='authModal', modal_tab='businessOwnerTab', modal_form='boSignup'))

        existing_owner = BusinessOwner.query.filter_by(email=email).first()
        if existing_owner:
            flash('Email address already registered.', 'error')
            return redirect(url_for('zms.zms_index', _anchor='authModal', modal_tab='businessOwnerTab', modal_form='boSignup'))

        new_owner = BusinessOwner(business_name=business_name, email=email)
        new_owner.set_password(password)
        
        try:
            db.session.add(new_owner)
            db.session.commit()
            flash('Business account created successfully! Please log in.', 'success')
            # On successful signup, redirect to login form within the modal
            return redirect(url_for('zms.zms_index', _anchor='authModal', modal_tab='businessOwnerTab', modal_form='boLogin'))
        except Exception as e:
            db.session.rollback()
            flash(f'An error occurred: {str(e)}', 'error')
            return redirect(url_for('zms.zms_index', _anchor='authModal', modal_tab='businessOwnerTab', modal_form='boSignup'))
            
    return redirect(url_for('zms.zms_index')) # Should not be reached via GET

@zms_bp.route('/auth/business/login', methods=['POST'])
def business_login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        if not email or not password:
            flash('Email and password are required.', 'error')
            return redirect(url_for('zms.zms_index', _anchor='authModal', modal_tab='businessOwnerTab', modal_form='boLogin'))

        owner = BusinessOwner.query.filter_by(email=email).first()

        if owner and owner.check_password(password):
            session['business_owner_id'] = owner.id
            session['user_type'] = 'business_owner'
            flash('Logged in successfully as Business Owner!', 'success')
            # TODO: Redirect to business owner dashboard
            return redirect(url_for('zms.zms_index')) # Placeholder redirect
        else:
            flash('Invalid email or password.', 'error')
            return redirect(url_for('zms.zms_index', _anchor='authModal', modal_tab='businessOwnerTab', modal_form='boLogin'))
            
    return redirect(url_for('zms.zms_index'))


@zms_bp.route('/auth/client/signup', methods=['POST'])
def client_signup():
    if request.method == 'POST':
        full_name = request.form.get('full_name')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')

        if not all([full_name, email, password, confirm_password]):
            flash('All fields are required.', 'error')
            return redirect(url_for('zms.zms_index', _anchor='authModal', modal_tab='clientTab', modal_form='clientSignup'))

        if password != confirm_password:
            flash('Passwords do not match.', 'error')
            return redirect(url_for('zms.zms_index', _anchor='authModal', modal_tab='clientTab', modal_form='clientSignup'))
        
        if len(password) < 8:
            flash('Password must be at least 8 characters long.', 'error')
            return redirect(url_for('zms.zms_index', _anchor='authModal', modal_tab='clientTab', modal_form='clientSignup'))

        existing_client = Client.query.filter_by(email=email).first()
        if existing_client:
            flash('Email address already registered.', 'error')
            return redirect(url_for('zms.zms_index', _anchor='authModal', modal_tab='clientTab', modal_form='clientSignup'))

        new_client = Client(full_name=full_name, email=email)
        new_client.set_password(password)
        
        try:
            db.session.add(new_client)
            db.session.commit()
            flash('Client account created successfully! Please log in.', 'success')
            return redirect(url_for('zms.zms_index', _anchor='authModal', modal_tab='clientTab', modal_form='clientLogin'))
        except Exception as e:
            db.session.rollback()
            flash(f'An error occurred: {str(e)}', 'error')
            return redirect(url_for('zms.zms_index', _anchor='authModal', modal_tab='clientTab', modal_form='clientSignup'))

    return redirect(url_for('zms.zms_index'))

@zms_bp.route('/auth/client/login', methods=['POST'])
def client_login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        if not email or not password:
            flash('Email and password are required.', 'error')
            return redirect(url_for('zms.zms_index', _anchor='authModal', modal_tab='clientTab', modal_form='clientLogin'))

        client = Client.query.filter_by(email=email).first()

        if client and client.check_password(password):
            session['client_id'] = client.id
            session['user_type'] = 'client'
            flash('Logged in successfully as Client!', 'success')
            # TODO: Redirect to client dashboard
            return redirect(url_for('zms.zms_index')) # Placeholder redirect
        else:
            flash('Invalid email or password.', 'error')
            return redirect(url_for('zms.zms_index', _anchor='authModal', modal_tab='clientTab', modal_form='clientLogin'))
            
    return redirect(url_for('zms.zms_index'))

@zms_bp.route('/auth/logout')
def logout():
    session.pop('business_owner_id', None)
    session.pop('client_id', None)
    session.pop('user_type', None)
    flash('You have been logged out.', 'success')
    return redirect(url_for('zms.zms_index'))