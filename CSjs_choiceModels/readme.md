# CityScope MoCho: Mobility Choices Table Module

This is a project-specific table module. MoCho (short for "Mobility Choices") is a CityScope module focused on mobility choices and societal impacts. This tool helps predict the choices of mobility modes made at the individual level throughout the entire Boston Metro area.

![](https://raw.githubusercontent.com/wiki/CityScope/CS_CityScopeJS_Simulation/img/MOCHO.gif)

Module is designed to work with [CityScopeJS](https://github.com/CityScope/CS_cityscopeJS) but should accept any cityIO data if properly structured.

Module is built to represent:

- CityScope grid retrieved from cityIO server on interval
- Visual rep. of cityIO data feature
- Analysis of grid+spatial data, such as: walkability, energy, mobility etc.

### Requirements:

- nodejs (version 10 tested) (`apt install nodejs`), which include `npm`
- parcel-bundler (`npm install -g parcel-bundler`)
- This module is deployed to `Github Pages [GH-Pages branch]` using `deploy2gh.sh`.
  - create an empty `ph-pages` branch
  - deploy to gh-pages using the `.sh`
