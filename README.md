### API ENDPOINTS

---

### Auth Service

-   [ post ] : /api/auth/register/send-otp

```ts
method : post,
url : '/api/auth/register/send-otp',

request body = {
    fullName : string;
    email : string;
    password : string;
    confirmPassword : string;
}

response data = {
    otpInfo : {
        hashOtp : string,
        fullName : string,
        email : string,
    }
    message : "Otp sent successfully."
}

```

-   [ post ] : /api/auth/register/verify-otp

```ts
method : post,
url : '/api/auth/register/verify-otp',

request body = {
    fullName : string;
    email : string;
    hashOtp : string;
    otp : string;
}

response data = {
    user : {
        id : number,
        fullName : string,
        email : string,
        // ... other user fields
    }
    message : "User registered successfully."
}

```
