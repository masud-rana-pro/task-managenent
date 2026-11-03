package com.fifotech.task.exception;
import org.springframework.http.*; import org.springframework.security.access.AccessDeniedException; import org.springframework.web.bind.MethodArgumentNotValidException; import org.springframework.web.bind.annotation.*; import org.springframework.http.converter.HttpMessageNotReadableException; import java.time.Instant; import java.util.*;
@RestControllerAdvice
public class GlobalExceptionHandler {
 private Map<String,Object> body(HttpStatus status,String message){return Map.of("timestamp",Instant.now().toString(),"status",status.value(),"error",status.getReasonPhrase(),"message",message);}
 @ExceptionHandler(ApiException.class) ResponseEntity<?> api(ApiException e){return ResponseEntity.status(e.getStatus()).body(body(e.getStatus(),e.getMessage()));}
 @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<?> validation(MethodArgumentNotValidException e){String m=e.getBindingResult().getFieldErrors().stream().map(x->x.getField()+": "+x.getDefaultMessage()).findFirst().orElse("Invalid request");return ResponseEntity.badRequest().body(body(HttpStatus.BAD_REQUEST,m));}
 @ExceptionHandler(AccessDeniedException.class) ResponseEntity<?> denied(){return ResponseEntity.status(403).body(body(HttpStatus.FORBIDDEN,"You do not have permission to perform this action"));}
 @ExceptionHandler(HttpMessageNotReadableException.class) ResponseEntity<?> unreadable(){return ResponseEntity.badRequest().body(body(HttpStatus.BAD_REQUEST,"Request contains invalid or missing values"));}
 @ExceptionHandler(Exception.class) ResponseEntity<?> unexpected(Exception e){return ResponseEntity.internalServerError().body(body(HttpStatus.INTERNAL_SERVER_ERROR,"An unexpected error occurred"));}
}
