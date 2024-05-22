from enum import Enum

class ticks(Enum):
    whole = 4
    whole_dot = 6
    whole_dot_fermata = 6
    whole_fermata = 4
    double_whole = 8
    double_whole_dot = 12
    double_whole_fermata = 8
    double_whole_dot_fermata = 12
    half = 2
    half_fermata = 2
    half_dot = 3
    half_dot_fermata = 3
    half_dot_dot = 3.5
    quarter = 1
    quarter_dot = 1.5
    quarter_dot_fermata = 1.5
    quarter_dot_dot = 1.75
    quarter_fermata = 1
    quadruple_whole = 16
    quadruple_whole_fermata = 16
    quadruple_whole_dot = 24
    eighth = 0.5
    eighth_dot = 0.75
    eighth_dot_fermata = 0.75
    eighth_dot_dot = 0.875
    eighth_fermata = 0.5
    sixteenth = 0.25
    sixteenth_dot = 0.375
    sixteenth_dot_fermata = 0.375
    sixteenth_dot_dot = 0.4375
    sixteenth_fermata = 0.25
    thirty_second = 0.125
    thirty_second_dot = 0.1875
    sixty_fourth = 0.0625
    sixty_fourth_dot = 0.09375