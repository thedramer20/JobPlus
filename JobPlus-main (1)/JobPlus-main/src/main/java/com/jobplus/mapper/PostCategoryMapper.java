package com.jobplus.mapper;

import com.jobplus.entity.PostCategory;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface PostCategoryMapper {

    @Select("""
        SELECT id, name, description, created_at
        FROM post_categories
        ORDER BY name ASC
        """)
    List<PostCategory> findAll();

    @Select("""
        SELECT id, name, description, created_at
        FROM post_categories
        WHERE id = #{id}
        """)
    PostCategory findById(Long id);

    @Select("""
        SELECT id, name, description, created_at
        FROM post_categories
        WHERE LOWER(name) = LOWER(#{name})
        """)
    PostCategory findByName(String name);
}
