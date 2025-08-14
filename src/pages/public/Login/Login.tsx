import React, { useState } from 'react'
import { Eye, EyeOff } from "lucide-react";
import { Roles } from '../../../models/Roles';
import APIs from '../../../services/services/APIs';
import useUserStore from '../../../store/General';
import { useNavigate } from 'react-router-dom';

import './Login.css'
import { PrivateRoutes } from '../../../models/routes';

export const Login = () => {
    const [showPassword, setShowPassword] = useState<any>(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { getUser }: any = useUserStore()
    const navigate = useNavigate();



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result: any = await APIs.login(email, password);
            getUser({ ...result, rol: Roles.USER });

            navigate(`/${PrivateRoutes.CRM}`, { replace: true }) // Envía la acción al store
            console.log('Inicio de sesión exitoso');

        } catch (error) {
        }
    };
    return (
        <div className="hisoft-container">
            <div className="hisoft-card">
                {/* Left Panel - Branding */}
                <div className="hisoft-left-panel">
                    <div className="hisoft-content">
                        <div className="hisoft-logo">
                            <div className="hisoft-logo-circle">H</div>
                        </div>

                        <h1 className="hisoft-title">
                            Editor de Páginas{" "}
                            <span className="hisoft-highlight">Profesional</span>
                        </h1>

                        <p className="hisoft-description">
                            Crea sitios web increíbles sin límites. Diseña, publica y gestiona
                            tu presencia digital con herramientas profesionales.
                        </p>
                    </div>

                    <div className="hisoft-footer">
                        <span>© 2024 HISOFT</span>
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="hisoft-right-panel">
                    <div className="hisoft-form-container">
                        <div className="hisoft-form-header">
                            <h2>Bienvenido a HISOFT</h2>
                            <p>Ingresa tus credenciales para acceder al editor</p>
                        </div>

                        <form onSubmit={handleSubmit} className="hisoft-form">
                            <div className="hisoft-form-group">
                                <label htmlFor="email" className="hisoft-label">
                                    Correo electrónico
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="hisoft-input"
                                    required
                                />
                            </div>

                            <div className="hisoft-form-group">
                                <label htmlFor="password" className="hisoft-label">
                                    Contraseña
                                </label>
                                <div className="hisoft-password-field">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="hisoft-input"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="hisoft-password-toggle"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="hisoft-submit-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="hisoft-loading">
                                        <div className="hisoft-spinner"></div>
                                        Iniciando sesión...
                                    </div>
                                ) : (
                                    "Iniciar Sesión"
                                )}
                            </button>
                        </form>

                        <div className="hisoft-forgot-password">
                            <a href="#">¿Olvidaste tu contraseña?</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
