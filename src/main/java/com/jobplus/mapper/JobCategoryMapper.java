package com.jobplus.mapper;

import com.jobplus.entity.JobCategory;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface JobCategoryMapper {

    @Select("SELECT id, name, description, created_at FROM job_categories ORDER BY name")
    List<JobCategory> findAll();

    @Select("SELECT id, name, description, created_at FROM job_categories WHERE id = #{id}")
    JobCategory findById(Long id);

    @Select("SELECT id, name, description, created_at FROM job_categories WHERE name = #{name}")
    JobCategory findByName(String name);

    @Insert("""
        INSERT INTO job_categories (name, description, created_at)
        VALUES (#{name}, #{description}, CURRENT_TIMESTAMP)
        """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(JobCategory jobCategory);
}
