package com.jobplus.mapper;

import com.jobplus.entity.JobSkill;
import com.jobplus.entity.Skill;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface JobSkillMapper {

    @Insert("""
        INSERT INTO job_skills (job_id, skill_id, created_at)
        VALUES (#{jobId}, #{skillId}, CURRENT_TIMESTAMP)
        """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(JobSkill jobSkill);

    @Select("""
        SELECT s.id, s.name, s.created_at
        FROM job_skills js
        JOIN skills s ON s.id = js.skill_id
        WHERE js.job_id = #{jobId}
        ORDER BY s.name
        """)
    List<Skill> findSkillsByJobId(Long jobId);
}
