package com.jobplus.mapper;

import com.jobplus.entity.Skill;
import com.jobplus.entity.UserSkill;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface UserSkillMapper {

    @Insert("""
        INSERT INTO user_skills (user_id, skill_id, created_at)
        VALUES (#{userId}, #{skillId}, CURRENT_TIMESTAMP)
        """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(UserSkill userSkill);

    @Select("""
        SELECT s.id, s.name, s.created_at
        FROM user_skills us
        JOIN skills s ON s.id = us.skill_id
        WHERE us.user_id = #{userId}
        ORDER BY s.name
        """)
    List<Skill> findSkillsByUserId(Long userId);
}
