import React, { useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../config/supabase';

const RegisterContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const RegisterCard = styled.div`
  background: #FFFFFF;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  text-align: center;
`;

const Logo = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #722F37;
`;

const Title = styled.h1`
  color: #722F37;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.p`
  color: #6B7280;
  margin-bottom: 2rem;
  font-size: 1.1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  text-align: left;
`;

const Label = styled.label`
  display: block;
  color: #374151;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #E5E7EB;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #722F37;
    box-shadow: 0 0 0 3px rgba(114, 47, 55, 0.1);
  }
  
  &::placeholder {
    color: #9CA3AF;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem;
  border: 2px solid #E5E7EB;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background: #FFFFFF;
  
  &:focus {
    outline: none;
    border-color: #722F37;
    box-shadow: 0 0 0 3px rgba(114, 47, 55, 0.1);
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%);
  color: #FFFFFF;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(114, 47, 55, 0.3);
  }
  
  &:disabled {
    background: #D1D5DB;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  background: #FEE2E2;
  color: #DC2626;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  border: 1px solid #FECACA;
`;

const SuccessMessage = styled.div`
  background: #D1FAE5;
  color: #065F46;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  border: 1px solid #A7F3D0;
`;

const LoginLink = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #E5E7EB;
  
  a {
    color: #722F37;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    rol: 'usuario'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validar datos
      if (!formData.nombre || !formData.apellido || !formData.email) {
        throw new Error('Todos los campos son obligatorios');
      }

      // Verificar si el email ya existe
      const { data: existingUser, error: checkError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', formData.email)
        .single();

      if (existingUser) {
        throw new Error('Este email ya está registrado');
      }

      // Crear usuario
      const { data: newUser, error: createError } = await supabase
        .from('usuarios')
        .insert([{
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          rol: formData.rol,
          activo: true
        }])
        .select()
        .single();

      if (createError) throw createError;

      setSuccess(`¡Usuario ${newUser.nombre} ${newUser.apellido} creado exitosamente!`);
      
      // Limpiar formulario
      setFormData({
        nombre: '',
        apellido: '',
        email: '',
        rol: 'usuario'
      });

      // Redirigir a login después de 2 segundos
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <Logo>🍽️</Logo>
        <Title>Registrar Usuario</Title>
        <Subtitle>CROSTY Software - Sistema de Gestión Gastronómica</Subtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              name="nombre"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ingresa tu nombre"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="apellido">Apellido</Label>
            <Input
              id="apellido"
              name="apellido"
              type="text"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Ingresa tu apellido"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="rol">Rol</Label>
            <Select
              id="rol"
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              required
            >
              <option value="usuario">👤 Usuario</option>
              <option value="admin">👑 Administrador</option>
              <option value="invitado">👋 Invitado</option>
            </Select>
          </InputGroup>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creando usuario...' : 'Crear Usuario'}
          </Button>
        </Form>

        <LoginLink>
          <p>¿Ya tienes una cuenta? <a href="/login">Iniciar sesión</a></p>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;
