module.exports = {
  hooks: {
    readPackage(pkg) {
      // Override @prisma/dev to use version without zeptomatch issue
      if (pkg.name === '@prisma/dev') {
        // Remove zeptomatch dependency
        if (pkg.dependencies && pkg.dependencies.zeptomatch) {
          delete pkg.dependencies.zeptomatch;
        }
      }
      return pkg;
    }
  }
};
