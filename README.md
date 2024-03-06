# 🌐


## Usage

```sh
# start dev server
npm run dev
```

### Model

The model is a slightly modified version of this [sketfab model](https://sketchfab.com/3d-models/earth-0caafb7e837047a688a3e504c0ea74af).


## TODO

- [x] 3d on earth avatar
- [x] location list versioning
- [ ] about page
  - describe inaccuracy of past timezone
  - attribution ( geonames.org, sketchfab )
- [x] fix sunlight
- [ ] improve label phy engine
- [x] improve cloudflare deployment process ([ref](https://medium.com/swlh/using-cloudflare-workers-and-github-actions-to-deploy-statically-generated-sites-c96b502d49c4))
- [ ] use svg flags instead of emojis, [those](https://www.npmjs.com/package/country-flag-icons) are nice
- [x] use a custom shader to highlight terrain and have a strict sunlight shadow
- [ ] use a input=range in place of the slider for accessibility [ref](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/slider_role)