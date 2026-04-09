package com.jobplus.mapper;

import com.jobplus.entity.Notification;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface NotificationMapper {

    @Insert("""
        INSERT INTO notifications (user_id, message, type, is_read, created_at)
        VALUES (#{userId}, #{message}, #{type}, #{isRead}, CURRENT_TIMESTAMP)
        """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Notification notification);

    @Select("""
        SELECT id, user_id, message, type, is_read, created_at
        FROM notifications
        WHERE user_id = #{userId}
        ORDER BY created_at DESC
        """)
    List<Notification> findByUserId(Long userId);
}
