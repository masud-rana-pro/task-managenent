package com.fifotech.task.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity @Table(name="tasks")
public class TaskItem {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false,length=200) private String title;
    @Column(columnDefinition="TEXT") private String description;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private TaskStatus status=TaskStatus.PENDING;
    @Enumerated(EnumType.STRING) @Column(nullable=false) private Priority priority=Priority.MEDIUM;
    private LocalDate deadline;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="assigned_to",nullable=false) private User assignedTo;
    @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="assigned_by",nullable=false) private User assignedBy;
    @Column(name="created_at",nullable=false,updatable=false) private LocalDateTime createdAt=LocalDateTime.now();
    @Column(name="updated_at") private LocalDateTime updatedAt=LocalDateTime.now();
    protected TaskItem() {}
    public TaskItem(String title,String description,Priority priority,LocalDate deadline,User assignedTo,User assignedBy){this.title=title;this.description=description;this.priority=priority;this.deadline=deadline;this.assignedTo=assignedTo;this.assignedBy=assignedBy;}
    @PreUpdate void touch(){updatedAt=LocalDateTime.now();}
    public Long getId(){return id;} public String getTitle(){return title;} public void setTitle(String v){title=v;} public String getDescription(){return description;} public void setDescription(String v){description=v;}
    public TaskStatus getStatus(){return status;} public void setStatus(TaskStatus v){status=v;} public Priority getPriority(){return priority;} public void setPriority(Priority v){priority=v;}
    public LocalDate getDeadline(){return deadline;} public void setDeadline(LocalDate v){deadline=v;} public User getAssignedTo(){return assignedTo;} public void setAssignedTo(User v){assignedTo=v;}
    public User getAssignedBy(){return assignedBy;} public void setAssignedBy(User v){assignedBy=v;} public LocalDateTime getCreatedAt(){return createdAt;} public LocalDateTime getUpdatedAt(){return updatedAt;}
}
