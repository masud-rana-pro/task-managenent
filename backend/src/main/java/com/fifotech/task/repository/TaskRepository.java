package com.fifotech.task.repository;
import com.fifotech.task.domain.*; import org.springframework.data.jpa.repository.*; import org.springframework.data.repository.query.Param; import java.util.*;
public interface TaskRepository extends JpaRepository<TaskItem,Long> {
 @Query("select t from TaskItem t join fetch t.assignedTo a join fetch t.assignedBy b where (:status is null or t.status=:status) and (:priority is null or t.priority=:priority) and (:assigneeId is null or a.id=:assigneeId) and (:employeeId is null or a.id=:employeeId) and (:managerId is null or (b.id=:managerId and a.manager.id=:managerId))")
 List<TaskItem> search(@Param("status") TaskStatus status,@Param("priority") Priority priority,@Param("assigneeId") Long assigneeId,@Param("employeeId") Long employeeId,@Param("managerId") Long managerId);
 @Query("select count(t) from TaskItem t where t.status=:status and (:employeeId is null or t.assignedTo.id=:employeeId) and (:managerId is null or (t.assignedBy.id=:managerId and t.assignedTo.manager.id=:managerId))") long countByScope(@Param("status") TaskStatus status,@Param("employeeId") Long employeeId,@Param("managerId") Long managerId);
 @Query("select count(t) from TaskItem t where (:employeeId is null or t.assignedTo.id=:employeeId) and (:managerId is null or (t.assignedBy.id=:managerId and t.assignedTo.manager.id=:managerId))") long countScope(@Param("employeeId") Long employeeId,@Param("managerId") Long managerId);
 @Query("select t from TaskItem t join fetch t.assignedTo a join fetch t.assignedBy b where t.id=:id") Optional<TaskItem> findDetailedById(@Param("id") Long id);
}
