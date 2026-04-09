package com.jobplus.mapper;

import com.jobplus.entity.Resume;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ResumeMapper {

    @Select("""
        SELECT id, user_id, file_name, file_path, uploaded_at
        FROM resumes
        WHERE id = #{id}
        """)
    Resume findById(Long id);

    @Select("""
        SELECT id, user_id, file_name, file_path, uploaded_at
        FROM resumes
        WHERE user_id = #{userId}
        ORDER BY uploaded_at DESC
        """)
    List<Resume> findByUserId(Long userId);

    @Insert("""
        INSERT INTO resumes (user_id, file_name, file_path, uploaded_at)
        VALUES (#{userId}, #{fileName}, #{filePath}, CURRENT_TIMESTAMP)
        """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Resume resume);
}
