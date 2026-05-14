package com.jobplus.mapper;

import com.jobplus.entity.Skill;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface SkillMapper {

    @Select("SELECT id, name, created_at FROM skills ORDER BY name")
    List<Skill> findAll();

    @Select("SELECT id, name, created_at FROM skills WHERE id = #{id}")
    Skill findById(Long id);

    @Select("SELECT id, name, created_at FROM skills WHERE name = #{name}")
    Skill findByName(String name);

    @Insert("""
        INSERT INTO skills (name, created_at)
        VALUES (#{name}, CURRENT_TIMESTAMP)
        """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Skill skill);
}
