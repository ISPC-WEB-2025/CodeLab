# CodeLab_Stock: sistema de gestión de stock

## 1. Descripción del proyecto

Este proyecto consiste en el desarrollo de una **plataforma web integral** diseñada para la administración y control de inventarios en tiempo real. La idea es que el sistema permita a las empresas gestionar sus productos, proveedores y movimientos de mercadería de manera ágil y centralizada.
  
Muchas pequeñas y medianas empresas aún dependen de procesos manuales o planillas de cálculo propensas a errores para controlar sus activos. Esto deriva en diversos problemas como:

  * *Falta de visibilidad*, es decir, no saber con certeza cuánta mercadería hay disponible.

  * *Pérdida de ventas*, debido a la ausencia de alertas tempranas en las bajas de stock.

  * *Desperdicio de capital* por exceso de productos estacionales o de baja rotación acumulados en depósito.

  * *Desorganización* y dificultad para rastrear entradas y salidas de distintas sucursales o depósitos.

Nuestra solución se diferencia por las siguientes características:

- **Modular y adaptable**: su estructura permite configurar categorías y atributos de productos según el rubro de la empresa (desde una ferretería hasta una tienda de ropa).

- **Escalable**: gracias al uso de una API REST sólida, el sistema puede crecer en funciones sin comprometer el rendimiento.

- **Accesibilidad total**: al ser una aplicación web, los dueños de negocio pueden monitorear su stock desde cualquier dispositivo con acceso a internet.

- **Interfaz intuitiva**: diseñada con foco en la experiencia de usuario (UX) para reducir la curva de aprendizaje del personal.


## 2. Instrucciones de instalación

### Prerrequisitos
- Python 3.x
- MySQL
- Git

1. Desde tu terminal, clonar el repositorio: `git clone ...`
2. Instala dependencias de frontend: (...)
3. Instala dependencias de backend:

```
1. Crea y activa el entorno virtual. Puedes hacerlo directamente sobre el directorio de tu repositorio local.
2. En terminal: pip install -r requirements.txt
3. Crea la base de datos en MySQL: nombre_db
4. Crea archivo .env y copia el contenido de .env_modelo a este archivo.
5. Completalo con tus datos para conectarte con tu servidor MySQL.
6. En terminal: python manage.py migrate
7. En terminal: python manage.py runserver
```

## Uso básico


## Lista de requerimientos

  ### Requerimientos Funcionales (RF)
   Definir 5 Requerimientos Funcionales (RF) que describan las acciones específicas que el usuario podrá realizar en el sistema.

  ### Requerimientos No Funcionales (RNF)
   Definir 3 Requerimientos No Funcionales (RNF) que establezcan las propiedades del sistema.


## Tecnologías utilizadas

* **Frontend:** Angular 
* **Backend:** Python & Django Rest Framework
* **Base de Datos:** MySQL
* **Estilos:** CSS3 & Bootstrap
