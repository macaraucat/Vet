package cl.vet.common.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadRequestException.class) // 400
    public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.of(HttpStatus.BAD_REQUEST, e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class) // 400 (@Valid)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.of(HttpStatus.BAD_REQUEST, "Los datos enviados no son válidos."));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class) // 400 (JSON/enum/fecha inválidos)
    public ResponseEntity<ErrorResponse> handleUnreadable(HttpMessageNotReadableException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ErrorResponse.of(HttpStatus.BAD_REQUEST, "Los datos enviados no son válidos."));
    }

    @ExceptionHandler(UnauthorizedException.class) // 401
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ErrorResponse.of(HttpStatus.UNAUTHORIZED, e.getMessage()));
    }

    @ExceptionHandler(AccessDeniedException.class) // 403 (@PreAuthorize)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ErrorResponse.of(HttpStatus.FORBIDDEN, "No tienes permisos para realizar esta acción."));
    }

    @ExceptionHandler(ResourceNotFoundException.class) // 404
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ErrorResponse.of(HttpStatus.NOT_FOUND, e.getMessage()));
    }

    @ExceptionHandler(InvalidStateException.class) // 409
    public ResponseEntity<ErrorResponse> handleInvalidState(InvalidStateException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(ErrorResponse.of(HttpStatus.CONFLICT, e.getMessage()));
    }

    @ExceptionHandler(Exception.class) // 500
    public ResponseEntity<ErrorResponse> handleGeneric(Exception e) {
        log.error("Error no controlado", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ErrorResponse.of(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno del servidor."));
    }
}