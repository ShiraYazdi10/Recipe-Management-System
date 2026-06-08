package com.example.dtos;

import lombok.Data;

@Data
public class RecipeDTO {
    private Long id;
    private String title;
    private String ingredients;
    private String instructions;
    private int cookingTime;
    private String difficulty;
}