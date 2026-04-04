package com.jobplus.mapper;

import com.jobplus.entity.Job;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface JobMapper {

    @Select("SELECT id, title, company FROM jobs")
    List<Job> getAllJobs();
}
