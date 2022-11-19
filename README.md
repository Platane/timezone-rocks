# 🌐

![type definitions](https://img.shields.io/npm/types/typescript?style=flat-square)
![code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/platane/timezone-rocks/test?label=test&style=flat-square)](https://github.com/Platane/timezone-rocks/actions/workflows/main.yml)

## Usage

```sh
# start dev server
npm run dev
```

### Location list for autocomplete

```sh
# generate autocomplete suggestion
npm run generateLocations
```

### Model

The model is a slightly modified version of this [sketfab model](https://sketchfab.com/3d-models/earth-0caafb7e837047a688a3e504c0ea74af).

The transformation scripting is located at src/App/Earth/generate/generate.ts. (uncomment the lines in src/index.ts to regenerate it)

## TODO

- [x] 3d on earth avatar
- [x] location list versioning
- [ ] about page
  - describe inaccuracy of past timezone
  - attribution ( geonames.org, sketchfab )
- [x] fix sunlight
- [ ] improve label phy engine
- [ ] improve cloudflare deployment process ([ref](https://medium.com/swlh/using-cloudflare-workers-and-github-actions-to-deploy-statically-generated-sites-c96b502d49c4))
- [ ] use svg flags instead of emojis, [those](https://www.npmjs.com/package/country-flag-icons) are nice

# Links

[staging](https://timezone-rocks-master.surge.sh)

[staging stress test](https://timezone-rocks-master.surge.sh/#WBLAmAAEIACYAAOAAJIAApgATCABuAAHgAEiAASYAJQgApgAS4ABsgAGmADcIAO4AE+AA==)

[dst jump](https://timezone-rocks-master.surge.sh/#WBLJsBJAA==-2021-03-28T01:00z)
