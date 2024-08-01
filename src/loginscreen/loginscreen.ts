function loginScreen() {
  document.getElementById("login")?.addEventListener("click", function () {
    const email = (document.getElementById("email") as HTMLInputElement)?.value;
    const password = (document.getElementById("password") as HTMLInputElement)
      ?.value;
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    try {
      chrome.runtime.sendMessage(
        {
          type: "login",
          email,
          password,
        },
        function (response) {
          console.log("login response", response);
          if (response && response.error) {
            setError(response.error);
          } else {
            console.log("Login successful");
            window.close();
          }
        }
      );
    } catch (error) {
      setError("An error occurred");
    } finally {
      //   onLogin();
    }
  });
}

loginScreen();

const setError = (error: string) => {
  const errorElement = document.getElementById("error");
  if (errorElement) {
    errorElement.innerText = error;
  }
};
