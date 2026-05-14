package com.jobplus.mapper;

import com.jobplus.entity.ApplicationStatusHistory;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ApplicationStatusHistoryMapper {

    @Insert("""
        INSERT INTO application_status_history (application_id, old_status, new_status, changed_by_user_id, note, changed_at)
        VALUES (#{applicationId}, #{oldStatus}, #{newStatus}, #{changedByUserId}, #{note}, CURRENT_TIMESTAMP)
        """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(ApplicationStatusHistory history);

    @Select("""
        SELECT id, application_id, old_status, new_status, changed_by_user_id, note, changed_at
        FROM application_status_history
        WHERE application_id = #{applicationId}
        ORDER BY changed_at ASC
        """)
    List<ApplicationStatusHistory> findByApplicationId(Long applicationId);
}
