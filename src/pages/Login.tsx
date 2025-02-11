import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/store/auth/authSlice';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface LoginFormData {
    email: string;
    password: string;
}

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
}

const Login = () => {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isResponseOk, setIsResponseOk] = useState<boolean>(false);
    const API_URL: ImportMetaEnv = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setIsResponseOk(false);
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/user/login`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const token: string = await response.text();

            if (!response.ok) {
                throw new Error('Erreur de connexion');
            }

            setIsResponseOk(true);
            localStorage.setItem('token', token);
            dispatch(login(token));
            successRedirect();
        } catch (err) {
            setIsResponseOk(false);
            setError(
                err instanceof Error ? err.message : 'Une erreur est survenue'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const successRedirect = () => {
        setTimeout(() => {
            navigate('/journeys');
        }, 1000);
    };

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle className='text-xl'>Login</CardTitle>
                <CardDescription>Allez tu peux te connecter</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <CardContent className="py-0">
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                placeholder="ton email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                placeholder="ton mot de passe"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </CardContent>
                {isLoading && (
                    <Alert className="my-4 mx-6 w-auto">
                        <AlertDescription>Demande en cours...</AlertDescription>
                    </Alert>
                )}
                {!isLoading && error && (
                    <Alert variant="destructive" className="my-4 mx-6 w-auto">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {!isLoading && isResponseOk && (
                    <Alert className="mx-6 w-auto">
                        <AlertDescription>C'est tout bon !</AlertDescription>
                    </Alert>
                )}
                <CardFooter className="flex justify-between">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Connexion...' : 'Connexion'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default Login;
