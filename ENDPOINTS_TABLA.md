# Tabla Resumen de Endpoints (Desarrollo Rápido)

| Recurso   | Método | Endpoint                        | Body / Params                | Rol requerido | Descripción breve                  |
|-----------|--------|---------------------------------|------------------------------|---------------|-------------------------------------|
| Login     | POST   | /auth/login                     | { email, password }          | -             | Login y obtención de JWT           |
| Usuarios  | GET    | /users                          | -                            | admin         | Listar todos los usuarios          |
| Usuario   | GET    | /users/:id                      | -                            | admin         | Ver usuario por id                 |
| Perfil    | GET    | /users/me                       | -                            | cualquier     | Ver perfil propio                  |
| Cursos de usuario | GET | /users/me/courses           | -                            | cualquier     | Ver cursos propios                 |
| Curso propio | GET | /users/me/courses/:courseId     | -                            | cualquier     | Ver detalle de curso propio        |
| Crear usuario | POST | /users                        | { email, password, name, role? } | admin     | Crear usuario                      |
| Actualizar usuario | PUT | /users/:id                 | { name?, password?, role? }  | admin         | Editar usuario                     |
| Eliminar usuario | DELETE | /users/:id                | -                            | admin         | Eliminar usuario                   |
| Cambiar contraseña | PUT | /users/:id/password        | { password }                 | cualquier     | Cambiar contraseña propia          |
| Inscribir a curso | POST | /users/:id/courses/:courseId | -                         | admin         | Inscribir usuario a curso          |
| Listar cursos | GET | /courses                       | -                            | admin         | Listar todos los cursos            |
| Ver curso   | GET    | /courses/:id                   | -                            | admin         | Ver curso por id                   |
| Crear curso | POST   | /courses                       | { name, description? }       | admin         | Crear curso                        |
| Editar curso| PUT    | /courses/:id                   | { name?, description? }      | admin         | Editar curso                       |
| Eliminar curso | DELETE | /courses/:id                | -                            | admin         | Eliminar curso                     |
| Healthcheck | GET    | /healthcheck                   | -                            | -             | Estado del sistema y DB            |

> **Nota:** Todos los endpoints protegidos requieren el header `Authorization: Bearer <token>`.

---

¿Quieres la tabla en otro formato o con ejemplos de request/response?
