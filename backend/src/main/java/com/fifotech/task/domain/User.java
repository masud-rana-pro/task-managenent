package com.fifotech.task.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity @Table(name="users")
public class User {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="full_name", nullable=false, length=100) private String fullName;
    @Column(nullable=false, unique=true, length=150) private String email;
    @Column(nullable=false) private String password;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private Role role;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="manager_id") private User manager;
    @Column(name="created_at", nullable=false, updatable=false) private LocalDateTime createdAt=LocalDateTime.now();
    @Column(nullable=false) private boolean active=true;
    protected User() {}
    public User(String fullName,String email,String password,Role role,User manager){this.fullName=fullName;this.email=email;this.password=password;this.role=role;this.manager=manager;}
    public Long getId(){return id;} public String getFullName(){return fullName;} public void setFullName(String v){fullName=v;}
    public String getEmail(){return email;} public void setEmail(String v){email=v;} public String getPassword(){return password;} public void setPassword(String v){password=v;}
    public Role getRole(){return role;} public void setRole(Role v){role=v;} public User getManager(){return manager;} public void setManager(User v){manager=v;}
    public LocalDateTime getCreatedAt(){return createdAt;} public boolean isActive(){return active;} public void setActive(boolean v){active=v;}
}
