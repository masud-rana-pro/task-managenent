package com.fifotech.task;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

@SpringBootApplication
@EnableMethodSecurity
public class TaskManagementApplication {
    public static void main(String[] args) { SpringApplication.run(TaskManagementApplication.class, args); }
}
