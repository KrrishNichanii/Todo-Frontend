import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/AuthService';
function SignUpPage() {
    const navigate = useNavigate() ;
    const onAuthSuccess = () => console.log('Auth success handler not provided.'), 
    showNotification = (msg, type) => console.log(`Notification: [${type.toUpperCase()}] ${msg}`) ;
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!username || !email || !password) {
            if (toast) toast.error("Please fill in all fields.");
            return;
        }

        setLoading(true);

        try {
            const response = await registerUser(username, email, password);
            
            const userData = response.user || response;

            onAuthSuccess(userData);
            
            if (toast) {
                toast.success("Registration successful! Sign In", { 
                    position: 'top-center',
                    duration: 2000 
                });
            }
            localStorage.setItem('user', JSON.stringify(userData.data));
            setTimeout(() => navigate('/signin', { replace: true }), 1000); 

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || "Registration failed. Please try again.";
            console.log("E" ,error) ; 
            if (toast) {
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };
    
  return (
    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" class="mx-auto h-10 w-auto" />
            <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Create an Account</h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} class="space-y-6">
            <div>
                <label for="username" class="block text-sm/6 font-medium text-gray-100">Username</label>
                <div class="mt-2">
                <input 
                  id="username" 
                  type="text" 
                  name="username" 
                  required  
                  class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
            </div>

            <div>
                <label for="email" class="block text-sm/6 font-medium text-gray-100">Email address</label>
                <div class="mt-2">
                <input 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} 
                  id="email" 
                  type="email" 
                  name="email" required autocomplete="email" class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                </div>
            </div>

            <div>
                <div class="flex items-center justify-between">
                <label for="password" class="block text-sm/6 font-medium text-gray-100">Password</label>

                </div>
                <div class="mt-2">
                <input 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password" type="password" name="password" required autocomplete="current-password" class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6" />
                </div>
            </div>

            <div>
                <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Sign up</button>
            </div>
            </form>
            <div className="mt-2 ml-15 text-amber-50">Already have an account ? <span className='hover:underline cursor-pointer text-blue-400' onClick = {() => navigate('/signin')} >  Sign In </span>  </div>
        </div>
    </div>
  )
}

export default SignUpPage