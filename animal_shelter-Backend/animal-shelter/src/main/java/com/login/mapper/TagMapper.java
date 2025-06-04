
package com.login.mapper;

import com.login.dto.TagDto;
import com.login.model.Tag;

public class TagMapper {

    public static TagDto toDto(Tag tag) {
        TagDto dto = new TagDto();
        dto.setId(tag.getId());
        dto.setName(tag.getName());
        dto.setDescription(tag.getDescription());
        dto.setColor(tag.getColor());
        dto.setIcon(tag.getIcon());
        return dto;
    }

    public static Tag toEntity(TagDto dto) {
        Tag tag = new Tag();
        tag.setId(dto.getId());
        tag.setName(dto.getName());
        tag.setDescription(dto.getDescription());
        tag.setColor(dto.getColor());
        tag.setIcon(dto.getIcon());
        return tag;
    }
}
