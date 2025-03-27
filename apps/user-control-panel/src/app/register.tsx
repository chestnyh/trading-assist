export function Register() {
    return (
        <div>
            <h1>Register</h1>
            <form>
                <div>
                    <label htmlFor="login">Login:</label>
                    <input type="text" id="login" name="login" required />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" required />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" required />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password-repeat" required />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}
  
export default Register;