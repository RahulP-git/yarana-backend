# Yarana Backend — Postman Testing Guide

## Base URL
```
http://localhost:5000/api/v1/auth
```

---

## Step 1: Register — Send OTP
**Endpoint:** `POST {{base_url}}/register/init`

**Headers:**
```
Content-Type: application/json
```

**Body (raw, JSON):**
```json
{
    "phone": "+919876543210",
    "role": "customer"
}
```

**Expected Response (200):**
```json
{
    "success": true,
    "message": "OTP sent successfully",
    "data": {
        "otp_session_id": "otp_...",
        "expires_in": 300
    }
}
```

> **Note:** Copy the `otp_session_id` from the response. Check your terminal/console for the actual OTP value (it logs there in development mode).

---

## Step 2: Verify OTP
**Endpoint:** `POST {{base_url}}/otp/verify`

**Headers:**
```
Content-Type: application/json
```

**Body (raw, JSON):**
```json
{
    "otp_session_id": "otp_...",
    "otp": "123456"
}
```

> Replace `otp_session_id` with the value from Step 1.
> Replace `otp` with the actual 6-digit OTP logged in your terminal.

**Expected Response (200):**
```json
{
    "success": true,
    "message": "OTP verified",
    "data": {
        "otp_verified_token": "vt_..."
    }
}
```

> **Note:** Copy the `otp_verified_token` from the response.

---

## Step 3: Resend OTP (Optional)
**Endpoint:** `POST {{base_url}}/otp/resend`

**Headers:**
```
Content-Type: application/json
```

**Body (raw, JSON):**
```json
{
    "otp_session_id": "otp_..."
}
```

**Expected Response (200):**
```json
{
    "success": true,
    "message": "OTP resent",
    "data": {
        "expires_in": 300
    }
}
```

---

## Step 4: Complete Registration — Customer
**Endpoint:** `POST {{base_url}}/register/customer`

**Headers:**
```
Content-Type: application/json
```

**Body (raw, JSON):**
```json
{
    "otp_verified_token": "vt_...",
    "full_name": "Priya Sharma",
    "email": "priya@email.com",
    "phone": "+919876543210",
    "current_address": "Bandra West, Mumbai, MH 400050",
    "location": {
        "lat": 19.0596,
        "lng": 72.8295
    },
    "password": "SecurePass123",
    "confirm_password": "SecurePass123",
    "profile_photo_url": "https://cdn.yarana.com/users/9182.jpg",
    "id_proof_url": "https://cdn.yarana.com/kyc/idproof_101.jpg",
    "accepted_terms": true
}
```

> Replace `otp_verified_token` with the value from Step 2.

**Expected Response (201):**
```json
{
    "success": true,
    "message": "Account created",
    "data": {
        "user": {
            "role": "customer",
            "fullName": "Priya Sharma",
            "email": "priya@email.com",
            "phone": "+919876543210",
            "profilePhoto": "https://cdn.yarana.com/users/9182.jpg",
            "currentAddress": "Bandra West, Mumbai, MH 400050",
            "location": { "lat": 19.0596, "lng": 72.8295 },
            "isVerified": false,
            "isActive": true,
            "rating": 0,
            "totalServices": 0,
            "totalSpent": 0,
            "createdAt": "2026-07-14T...",
            "updatedAt": "2026-07-14T..."
        },
        "access_token": "eyJhbGciOi...",
        "refresh_token": "eyJhbGciOi...",
        "expires_in": 3600
    }
}
```

> **Note:** Copy both `access_token` and `refresh_token` from the response.

---

## Step 5: Complete Registration — Provider (Alternative to Step 4)
**Endpoint:** `POST {{base_url}}/register/provider`

**Headers:**
```
Content-Type: application/json
```

**Body (raw, JSON):**
```json
{
    "otp_verified_token": "vt_...",
    "full_name": "Raju Kumar",
    "business_name": "Raju Plumbing Co.",
    "email": "raju@email.com",
    "phone": "+919812345678",
    "current_address": "Andheri East, Mumbai",
    "password": "SecurePass123",
    "confirm_password": "SecurePass123",
    "accepted_terms": true
}
```

**Expected Response (201):**
```json
{
    "success": true,
    "message": "Provider account created. KYC under review.",
    "data": {
        "provider": {
            "role": "provider",
            "fullName": "Raju Kumar",
            "email": "raju@email.com",
            "phone": "+919812345678",
            "currentAddress": "Andheri East, Mumbai",
            "isVerified": false,
            "isActive": true
        },
        "access_token": "eyJhbGciOi...",
        "refresh_token": "eyJhbGciOi...",
        "expires_in": 3600
    }
}
```

---

## Step 6: Login
**Endpoint:** `POST {{base_url}}/login`

**Headers:**
```
Content-Type: application/json
```

**Body (raw, JSON):**
```json
{
    "identifier": "+919876543210",
    "password": "SecurePass123",
    "role": "customer"
}
```

> `identifier` can be either phone number or email.

**Expected Response (200):**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "role": "customer",
            "fullName": "Priya Sharma",
            "email": "priya@email.com",
            "phone": "+919876543210",
            "isVerified": false,
            "isActive": true
        },
        "access_token": "eyJhbGciOi...",
        "refresh_token": "eyJhbGciOi...",
        "expires_in": 3600
    }
}
```

**Error Response (401) — Invalid credentials:**
```json
{
    "success": false,
    "message": "Invalid credentials",
    "error_code": "INVALID_CREDENTIALS"
}
```

---

## Step 7: Refresh Token
**Endpoint:** `POST {{base_url}}/refresh`

**Headers:**
```
Content-Type: application/json
```

**Body (raw, JSON):**
```json
{
    "refresh_token": "eyJhbGciOi..."
}
```

> Use the `refresh_token` from Step 4 or Step 6.

**Expected Response (200):**
```json
{
    "success": true,
    "message": "Token refreshed",
    "data": {
        "access_token": "new-access-token",
        "expires_in": 3600
    }
}
```

---

## Step 8: Forgot Password — Send OTP
**Endpoint:** `POST {{base_url}}/forgot-password/init`

**Headers:**
```
Content-Type: application/json
```

**Body (raw, JSON):**
```json
{
    "identifier": "+919876543210"
}
```

**Expected Response (200):**
```json
{
    "success": true,
    "message": "OTP sent successfully",
    "data": {
        "otp_session_id": "otp_...",
        "expires_in": 300
    }
}
```

---

## Step 9: Reset Password
**Endpoint:** `POST {{base_url}}/forgot-password/reset`

**Headers:**
```
Content-Type: application/json
```

**Body (raw, JSON):**
```json
{
    "otp_verified_token": "vt_...",
    "new_password": "NewSecurePass456",
    "confirm_password": "NewSecurePass456"
}
```

> `otp_verified_token` is obtained by verifying the OTP from Step 8 (same flow as Steps 1–2).

**Expected Response (200):**
```json
{
    "success": true,
    "message": "Password reset successfully"
}
```

---

## Step 10: Logout
**Endpoint:** `POST {{base_url}}/logout`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <access_token>
```

**Body (raw, JSON):**
```json
{
    "refresh_token": "eyJhbGciOi..."
}
```

**Expected Response (200):**
```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

---

## Environment Variables Setup in Postman

Create these variables in your Postman environment:

| Variable | Initial Value | Description |
|---|---|---|
| `base_url` | `http://localhost:5000` | Server base URL |
| `access_token` | *(empty)* | Fill after login/register |
| `refresh_token` | *(empty)* | Fill after login/register |
| `otp_session_id` | *(empty)* | Fill after Step 1 |
| `otp_verified_token` | *(empty)* | Fill after Step 2 |

Use `{{variable_name}}` in your requests to reference these.

---

## Testing Order Summary

| Order | Step | Endpoint | Purpose |
|---|---|---|---|
| 1 | Register Init | `POST /register/init` | Send OTP to phone |
| 2 | Verify OTP | `POST /otp/verify` | Verify OTP, get token |
| 3 | Resend OTP | `POST /otp/resend` | Resend if needed |
| 4 | Register Customer | `POST /register/customer` | Create customer account |
| 5 | Register Provider | `POST /register/provider` | Create provider account |
| 6 | Login | `POST /login` | Login with phone/email |
| 7 | Refresh Token | `POST /refresh` | Get new access token |
| 8 | Forgot Password | `POST /forgot-password/init` | Send reset OTP |
| 9 | Reset Password | `POST /forgot-password/reset` | Reset password |
| 10 | Logout | `POST /logout` | Logout user |

---

## Important Notes

1. **OTP is logged to terminal** — Check your server console for the OTP value during development.
2. **Access tokens expire in 1 hour** — Use the refresh endpoint to get new ones.
3. **Refresh tokens expire in 7 days** — Store them securely.
4. **Passwords must contain:** uppercase, lowercase, number, and special character (`@$!%*?&`).
5. **All error responses include `error_code`** for Flutter app handling.
