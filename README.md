# Task Manager

Este proyecto es una aplicación de gestión de tareas construida con React y Supabase.

## Tecnologías utilizadas

- React.js
- Supabase

## Cómo contribuir

1. Haz un "Fork" del repositorio.
2. Clona tu fork en tu máquina local (`git clone https://github.com/statick88/task`).
3. Crea una nueva rama para tus cambios (`git checkout -b nombre-de-tu-rama`).
4. Realiza tus cambios y haz un commit (`git commit -m "Descripción de los cambios"`).
5. Haz un push a tu rama (`git push origin nombre-de-tu-rama`).
6. Crea un "Pull Request" desde tu rama en GitHub.

## Configuración de Supabase

1. Crea una cuenta en [Supabase](https://supabase.io/).
2. Crea un nuevo proyecto.
3. En la sección "Database", crea una nueva tabla para las tareas. Puedes usar el siguiente código SQL:
```sql
CREATE TABLE task (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```	
4. Configura las variables de entorno `VITE_REACT_APP_SUPABASE_URL` y `VITE_REACT_APP_SUPABASE_ANON_KEY` con los valores proporcionados por Supabase.

## Mejoras futuras

- ❌ Autenticación de usuarios.
- ❌ Asignación de tareas a usuarios.
- ❌ Actualización de tareas: permitir a los usuarios modificar las tareas existentes.
- ❌ Notificaciones por correo electrónico cuando se asigna una tarea.
- ❌ Filtros para la lista de tareas.
- ❌ Ruta de tareas completadas: mostrar en una ruta separada las tareas que ya se han realizado.