package com.jobplus.mapper;

import com.jobplus.entity.JobApplication;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface ApplicationMapper {

    @Select("""
        SELECT COUNT(*) > 0
        FROM applications
        WHERE job_id = #{jobId} AND candidate_user_id = #{candidateUserId}
        """)
    boolean existsByJobIdAndCandidateUserId(@Param("jobId") Long jobId, @Param("candidateUserId") Long candidateUserId);

    @Insert("""
        INSERT INTO applications (job_id, candidate_user_id, resume_id, cover_letter, status, applied_at, updated_at)
        VALUES (#{jobId}, #{candidateUserId}, #{resumeId}, #{coverLetter}, #{status}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(JobApplication application);

    @Select("""
        SELECT a.id, a.job_id, j.title AS job_title, a.candidate_user_id, u.username AS candidate_username,
               a.resume_id, a.cover_letter, a.status, a.applied_at, a.updated_at
        FROM applications a
        JOIN jobs j ON j.id = a.job_id
        JOIN users u ON u.id = a.candidate_user_id
        WHERE a.candidate_user_id = #{candidateUserId}
        ORDER BY a.applied_at DESC
        """)
    List<JobApplication> findByCandidateUserId(Long candidateUserId);

    @Select("""
        SELECT a.id, a.job_id, j.title AS job_title, a.candidate_user_id, u.username AS candidate_username,
               a.resume_id, a.cover_letter, a.status, a.applied_at, a.updated_at
        FROM applications a
        JOIN jobs j ON j.id = a.job_id
        JOIN users u ON u.id = a.candidate_user_id
        WHERE a.job_id = #{jobId}
        ORDER BY a.applied_at DESC
        """)
    List<JobApplication> findByJobId(Long jobId);

    @Select("""
        SELECT a.id, a.job_id, j.title AS job_title, a.candidate_user_id, u.username AS candidate_username,
               a.resume_id, a.cover_letter, a.status, a.applied_at, a.updated_at
        FROM applications a
        JOIN jobs j ON j.id = a.job_id
        JOIN users u ON u.id = a.candidate_user_id
        WHERE a.id = #{id}
        """)
    JobApplication findById(Long id);

    @Update("""
        UPDATE applications
        SET status = #{status},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = #{id}
        """)
    int updateStatus(@Param("id") Long id, @Param("status") String status);
}
