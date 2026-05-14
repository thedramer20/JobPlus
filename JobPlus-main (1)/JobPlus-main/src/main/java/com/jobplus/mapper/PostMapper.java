package com.jobplus.mapper;

import com.jobplus.entity.Post;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface PostMapper {

    @Insert("""
        INSERT INTO posts (user_id, category_id, content, image_url, created_at, updated_at)
        VALUES (#{userId}, #{categoryId}, #{content}, #{imageUrl}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Post post);

    @Select("""
        SELECT p.id, p.user_id, u.username AS author_username, u.full_name AS author_full_name,
               p.category_id, pc.name AS category_name, p.content, p.image_url,
               COALESCE(COUNT(pl.id), 0) AS like_count, p.created_at, p.updated_at
        FROM posts p
        JOIN users u ON u.id = p.user_id
        JOIN post_categories pc ON pc.id = p.category_id
        LEFT JOIN post_likes pl ON pl.post_id = p.id
        GROUP BY p.id, p.user_id, u.username, u.full_name, p.category_id, pc.name, p.content, p.image_url, p.created_at, p.updated_at
        ORDER BY p.created_at DESC
        """)
    List<Post> findAllFeed();

    @Select("""
        SELECT p.id, p.user_id, u.username AS author_username, u.full_name AS author_full_name,
               p.category_id, pc.name AS category_name, p.content, p.image_url,
               COALESCE(COUNT(pl.id), 0) AS like_count, p.created_at, p.updated_at
        FROM posts p
        JOIN users u ON u.id = p.user_id
        JOIN post_categories pc ON pc.id = p.category_id
        LEFT JOIN post_likes pl ON pl.post_id = p.id
        GROUP BY p.id, p.user_id, u.username, u.full_name, p.category_id, pc.name, p.content, p.image_url, p.created_at, p.updated_at
        ORDER BY like_count DESC, p.created_at DESC
        """)
    List<Post> findTrending();

    @Select("""
        SELECT p.id, p.user_id, u.username AS author_username, u.full_name AS author_full_name,
               p.category_id, pc.name AS category_name, p.content, p.image_url,
               COALESCE(COUNT(pl.id), 0) AS like_count, p.created_at, p.updated_at
        FROM posts p
        JOIN users u ON u.id = p.user_id
        JOIN post_categories pc ON pc.id = p.category_id
        LEFT JOIN post_likes pl ON pl.post_id = p.id
        WHERE p.id = #{id}
        GROUP BY p.id, p.user_id, u.username, u.full_name, p.category_id, pc.name, p.content, p.image_url, p.created_at, p.updated_at
        """)
    Post findById(Long id);

    @Select("SELECT COUNT(*) > 0 FROM post_likes WHERE post_id = #{postId} AND user_id = #{userId}")
    boolean isLikedByUser(@Param("postId") Long postId, @Param("userId") Long userId);

    @Insert("""
        INSERT INTO post_likes (post_id, user_id, created_at)
        VALUES (#{postId}, #{userId}, CURRENT_TIMESTAMP)
        """)
    int insertLike(@Param("postId") Long postId, @Param("userId") Long userId);

    @Delete("""
        DELETE FROM post_likes
        WHERE post_id = #{postId} AND user_id = #{userId}
        """)
    int deleteLike(@Param("postId") Long postId, @Param("userId") Long userId);
}
