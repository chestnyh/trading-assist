export function Login() {
  return (
    <div>
      <h1>Log in</h1>
      <form>
        <div>
          <label htmlFor="login">Login:</label>
          <input type="text" id="login" name="login" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}

export default Login;