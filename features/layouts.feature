Feature: Layouts
  In order to have greater control over the look and feel of my website
  As a User
  I want custom html templates

  Background:
    Given I log in as Joe Admin
    And I create Html card "simple layout" with content "Simple Header {{_main}} Simple Footer"
    And I create Pointer card "*default+*layout" with content "[[simple layout]]"
    And I create Pattern card "*is type+*rform" with content "{"type": "_self"}"
    And I create Pointer card "User+*is type+*layout" with content "[[user layout]]"
    And I create Html card "user layout" with content "User Header {{_main}}"

  Scenario: I visit a Basic card with the simple layout
    When I go to card "*account links"
    Then I should see "Simple Header"
    And I should see "Invite a Friend"
  
  Scenario: I visit a User card with the user layout
    When I go to card "Joe User"
    Then I should see "User Header"
  


