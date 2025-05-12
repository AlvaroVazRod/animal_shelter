import React, { useState } from 'react';

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:3030/user/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en el inicio de sesión');
            }

            const data = await response.json();
            // Guarda el token o usuario en el localStorage, context, etc.
            console.log(data);

            // Redirigir o actualizar estado
            // Por ejemplo:
            // navigate('/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                    Iniciar Sesión
                </h2>

                {error && (
                    <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
                )}

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="email">
                        Correo electrónico
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2" htmlFor="password">
                        Contraseña
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {loading ? 'Cargando...' : 'Ingresar'}
                </button>
            </form>
        </div>
    );
};
