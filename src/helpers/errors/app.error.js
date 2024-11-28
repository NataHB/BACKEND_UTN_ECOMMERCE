class AppError extends Error {
        constructor(message, status_code) {
            if(typeof message === "object") message = JSON.stringify(message)
            super(message)
            this.status_code = status_code
            this.status = String(status_code).startsWith("4") ? "FAIL" : "ERROR" 
            this.is_operational = true
            Error.captureStackTrace(this, this.constructor); // captura la pila de errores
        }
    }
    
    export default AppError