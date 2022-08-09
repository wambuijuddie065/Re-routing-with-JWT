const password = document.getElementById("password") as HTMLInputElement;
const nam = document.getElementById("name") as HTMLInputElement;
const submit = document.getElementById("submit") as HTMLButtonElement;

const register_name = document.getElementById(
    "register_name"
) as HTMLInputElement;
const register_email = document.getElementById(
    "register_email"
) as HTMLInputElement;
const register_password = document.getElementById(
    "register_password"
) as HTMLInputElement;
const register = document.getElementById("register") as HTMLButtonElement;

class Users {
    static getUser() {
        return new Users();
    }
    constructor() { }

    loginUser(email: string, password: string) {
        const prom = new Promise<{
            error?: string;
            token?: string;
            message?: string;
        }>((resolve, reject) => {
            fetch("http://localhost:5000/user/login", {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    "email": email,
                    "password": password,
                }),
            })
                .then((res) => {
                    resolve(res.json());
                    
                })
                .catch((err) => {
                    reject(err);
                });
        });
        prom
            .then((data) => {
                data.token ? localStorage.setItem("token", data.token) : "";
                this.redirect()
            })
            .catch((err) => console.log(err));
    }
    registerUser(
        register_name: string,
        register_email: string,
        register_password: string
    ) {
        const prom = new Promise<{ error?: string; message?: string }>(
            (resolve, reject) => {
                fetch("http://localhost:5000/user/signup", {
                    headers: {
                        "accept": "application/json",
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({
                        "email": register_email,
                        "password": register_password,
                        "name": register_name,
                    }),
                })
                    .then((res) => {
                        resolve(res.json());
                    })
                    .catch((err) => {
                        reject(err);
                    });
            }
        );
        prom.then((data) => console.log(data)).catch((err) => console.log(err));
    }
    redirect() {
        const token = localStorage.getItem("token") as string;
        new Promise<{ name: string, role: string }>((resolve, reject) => {
            fetch("http://localhost:5000/user/check", {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "token": token,
                },
                method: "GET",
            }).then(res => resolve(res.json())).catch(err => reject(err))
        }).then(data=>
            {console.log(data)
                localStorage.setItem('name',data.name)
                if (data.role=='admin') {
                    location.href='adminDashboard.html'
                    
                } else {
                    location.href='userDashboard.html'
                    
                }
            
            }
        )
    }
}
submit.addEventListener("click", () => {
    const nameinput = nam.value;
    const passwordinput = password.value;

    if (nameinput == "" || passwordinput == "") {
        console.log("Please fill in all fields");
    } else {
        Users.getUser().loginUser(nameinput, passwordinput);
    }
});

register.addEventListener("click", () => {
    const nameinput = register_name.value;
    const emailinput = register_email.value;
    const passwordinput = register_password.value;

    if (nameinput == "" || emailinput == "" || passwordinput == "") {
        console.log("Please fill in all fields");
    } else {
        Users.getUser().registerUser(nameinput, emailinput, passwordinput);
    }
});
