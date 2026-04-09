package com.jobplus.mapper;

import com.jobplus.entity.SavedJob;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface SavedJobMapper {

    @Insert("""
        INSERT INTO saved_jobs (user_id, job_id, saved_at)
        VALUES (#{userId}, #{jobId}, CURRENT_TIMESTAMP)
        """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SavedJob savedJob);

    @Select("""
        SELECT id, user_id, job_id, saved_at
        FROM saved_jobs
        WHERE user_id = #{userId}
        ORDER BY saved_at DESC
        """)
    List<SavedJob> findByUserId(Long userId);
}
