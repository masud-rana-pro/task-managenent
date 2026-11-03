package com.fifotech.task.dto;

import com.fifotech.task.domain.*;
import jakarta.validation.constraints.*;
import java.time.*;

public final class ApiDtos {
 private ApiDtos(){}
 public record LoginRequest(@NotBlank @Email String email,@NotBlank String password){}
 public record LoginResponse(String token,Role role,String name,String email,Long id){}
 public record UserRequest(@NotBlank @Size(max=100) String fullName,@NotBlank @Email @Size(max=150) String email,@Size(min=8,max=72) String password,@NotNull Role role,Long managerId,Boolean active){}
 public record UserResponse(Long id,String fullName,String email,Role role,Long managerId,String managerName,boolean active,LocalDateTime createdAt){}
 public record TaskRequest(@NotBlank @Size(max=200) String title,@Size(max=10000) String description,@NotNull Priority priority,@FutureOrPresent LocalDate deadline,@NotNull Long assignedToId){}
 public record StatusRequest(@NotNull TaskStatus status){}
 public record TaskResponse(Long id,String title,String description,TaskStatus status,Priority priority,LocalDate deadline,Long assignedToId,String assigneeName,Long assignedById,String assignerName,LocalDateTime createdAt,LocalDateTime updatedAt){}
 public record DashboardResponse(long totalUsers,long totalTasks,long completedTasks,long teamSize,long pending,long inProgress,long done){}
}
