// * PackageInfo.ts : Take care of anything about Package

export default class PackageInfo {
    static get pkg_version(): string {
        return process.env.npm_package_version ?? "2.x.x";
    }
}
