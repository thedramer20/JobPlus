package com.jobplus.mapper;

import com.jobplus.entity.Job;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface JobMapper {

    @Insert("""
        INSERT INTO jobs (
            company_id, category_id, title, description, requirements, location, job_type, work_mode, experience_level,
            salary_min, salary_max, currency, vacancy_count, application_deadline, status, created_at, updated_at
        )
        VALUES (
            #{companyId}, #{categoryId}, #{title}, #{description}, #{requirements}, #{location}, #{jobType}, #{workMode}, #{experienceLevel},
            #{salaryMin}, #{salaryMax}, #{currency}, #{vacancyCount}, #{applicationDeadline}, #{status}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
        )
        """)
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Job job);

    @Select("""
        SELECT j.id, j.company_id, c.company_name, j.category_id, jc.name AS category_name, j.title, j.description, j.requirements, j.location, j.job_type,
               j.work_mode, j.experience_level, j.salary_min, j.salary_max, j.currency, j.vacancy_count,
               j.application_deadline, j.status, j.created_at, j.updated_at
        FROM jobs j
        JOIN companies c ON c.id = j.company_id
        JOIN job_categories jc ON jc.id = j.category_id
        WHERE j.status = 'OPEN'
        ORDER BY j.created_at DESC
        """)
    List<Job> findAllOpenJobs();

    @Select({
        "<script>",
        "SELECT j.id, j.company_id, c.company_name, j.category_id, jc.name AS category_name, j.title, j.description, j.requirements, j.location, j.job_type,",
        "       j.work_mode, j.experience_level, j.salary_min, j.salary_max, j.currency, j.vacancy_count,",
        "       j.application_deadline, j.status, j.created_at, j.updated_at",
        "FROM jobs j",
        "JOIN companies c ON c.id = j.company_id",
        "JOIN job_categories jc ON jc.id = j.category_id",
        "WHERE j.status = 'OPEN'",
        "<if test='query != null and query != \"\"'>",
        "  AND (LOWER(j.title) LIKE CONCAT('%', LOWER(#{query}), '%')",
        "       OR LOWER(c.company_name) LIKE CONCAT('%', LOWER(#{query}), '%')",
        "       OR LOWER(jc.name) LIKE CONCAT('%', LOWER(#{query}), '%'))",
        "</if>",
        "<if test='jobTypes != null and jobTypes.size() > 0'>",
        "  AND j.job_type IN",
        "  <foreach item='item' collection='jobTypes' open='(' separator=',' close=')'>#{item}</foreach>",
        "</if>",
        "<if test='experienceLevels != null and experienceLevels.size() > 0'>",
        "  AND j.experience_level IN",
        "  <foreach item='item' collection='experienceLevels' open='(' separator=',' close=')'>#{item}</foreach>",
        "</if>",
        "<if test='locations != null and locations.size() > 0'>",
        "  AND j.location IN",
        "  <foreach item='item' collection='locations' open='(' separator=',' close=')'>#{item}</foreach>",
        "</if>",
        "<if test='companies != null and companies.size() > 0'>",
        "  AND c.company_name IN",
        "  <foreach item='item' collection='companies' open='(' separator=',' close=')'>#{item}</foreach>",
        "</if>",
        "<if test='workModes != null and workModes.size() > 0'>",
        "  AND j.work_mode IN",
        "  <foreach item='item' collection='workModes' open='(' separator=',' close=')'>#{item}</foreach>",
        "</if>",
        "<if test='minSalary != null'>",
        "  AND ((j.salary_max IS NOT NULL AND j.salary_max &gt;= #{minSalary})",
        "       OR (j.salary_min IS NOT NULL AND j.salary_min &gt;= #{minSalary}))",
        "</if>",
        "ORDER BY j.created_at DESC",
        "</script>"
    })
    List<Job> findOpenJobsFiltered(@Param("query") String query,
                                   @Param("jobTypes") List<String> jobTypes,
                                   @Param("experienceLevels") List<String> experienceLevels,
                                   @Param("locations") List<String> locations,
                                   @Param("companies") List<String> companies,
                                   @Param("workModes") List<String> workModes,
                                   @Param("minSalary") Integer minSalary);

    @Select("""
        SELECT j.id, j.company_id, c.company_name, j.category_id, jc.name AS category_name, j.title, j.description, j.requirements, j.location, j.job_type,
               j.work_mode, j.experience_level, j.salary_min, j.salary_max, j.currency, j.vacancy_count,
               j.application_deadline, j.status, j.created_at, j.updated_at
        FROM jobs j
        JOIN companies c ON c.id = j.company_id
        JOIN job_categories jc ON jc.id = j.category_id
        ORDER BY j.created_at DESC
        """)
    List<Job> findAll();

    @Select("""
        SELECT j.id, j.company_id, c.company_name, j.category_id, jc.name AS category_name, j.title, j.description, j.requirements, j.location, j.job_type,
               j.work_mode, j.experience_level, j.salary_min, j.salary_max, j.currency, j.vacancy_count,
               j.application_deadline, j.status, j.created_at, j.updated_at
        FROM jobs j
        JOIN companies c ON c.id = j.company_id
        JOIN job_categories jc ON jc.id = j.category_id
        WHERE j.id = #{id}
        """)
    Job findById(Long id);

    @Select("""
        SELECT j.id, j.company_id, c.company_name, j.category_id, jc.name AS category_name, j.title, j.description, j.requirements, j.location, j.job_type,
               j.work_mode, j.experience_level, j.salary_min, j.salary_max, j.currency, j.vacancy_count,
               j.application_deadline, j.status, j.created_at, j.updated_at
        FROM jobs j
        JOIN companies c ON c.id = j.company_id
        JOIN job_categories jc ON jc.id = j.category_id
        WHERE j.company_id = #{companyId}
        ORDER BY j.created_at DESC
        """)
    List<Job> findByCompanyId(Long companyId);

    @Update("""
        UPDATE jobs
        SET title = #{title},
            category_id = #{categoryId},
            description = #{description},
            requirements = #{requirements},
            location = #{location},
            job_type = #{jobType},
            work_mode = #{workMode},
            experience_level = #{experienceLevel},
            salary_min = #{salaryMin},
            salary_max = #{salaryMax},
            currency = #{currency},
            vacancy_count = #{vacancyCount},
            application_deadline = #{applicationDeadline},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = #{id}
        """)
    int update(Job job);

    @Update("""
        UPDATE jobs
        SET status = #{status},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = #{id}
        """)
    int updateStatus(@Param("id") Long id, @Param("status") String status);
}
