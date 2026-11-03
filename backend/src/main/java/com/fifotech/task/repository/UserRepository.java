package com.fifotech.task.repository;
import com.fifotech.task.domain.*; import org.springframework.data.domain.*; import org.springframework.data.jpa.repository.*; import org.springframework.data.repository.query.Param; import java.util.*;
public interface UserRepository extends JpaRepository<User,Long> {
 Optional<User> findByEmailIgnoreCase(String email); boolean existsByEmailIgnoreCase(String email);
 Page<User> findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String name,String email,Pageable pageable);
 List<User> findByManagerIdAndActiveTrue(Long managerId); long countByManagerIdAndActiveTrue(Long managerId);
 List<User> findByRoleAndActiveTrue(Role role);
 @Query("select count(u) from User u where u.role=:role and u.manager.id=:managerId") long countTeamByRole(@Param("role") Role role,@Param("managerId") Long managerId);
}
