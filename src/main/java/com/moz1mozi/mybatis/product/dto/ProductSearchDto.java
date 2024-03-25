package com.moz1mozi.mybatis.product.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder(toBuilder = true)
public class ProductSearchDto {
    private String prodName;
    private String nickname;
    private Integer startPrice;
    private Integer endPrice;
    private Integer page;
    private Integer pageSize;
    public ProductSearchDto withPaging(int page, int pageSize) {
        return this.toBuilder()
                .page(page)
                .pageSize(pageSize)
                .build();
    }
}