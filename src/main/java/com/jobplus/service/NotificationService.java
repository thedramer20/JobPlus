package com.jobplus.service;

import com.jobplus.dto.NotificationResponse;
import com.jobplus.entity.Notification;
import com.jobplus.entity.User;
import com.jobplus.mapper.NotificationMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    private final NotificationMapper notificationMapper;
    private final UserService userService;

    public NotificationService(NotificationMapper notificationMapper, UserService userService) {
        this.notificationMapper = notificationMapper;
        this.userService = userService;
    }

    public List<NotificationResponse> getMyNotifications(String username) {
        User user = userService.getUserByUsername(username);
        return notificationMapper.findByUserId(user.getId()).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    private NotificationResponse toResponse(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        response.setMessage(notification.getMessage());
        response.setType(notification.getType());
        response.setIsRead(notification.getIsRead());
        response.setCreatedAt(notification.getCreatedAt());
        return response;
    }
}
