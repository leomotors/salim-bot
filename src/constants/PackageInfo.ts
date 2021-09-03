// * PackageInfo.ts : Take care of anything about Package

export class PackageInfo {
    static pkg_version: string;

    static construct(): void {
        PackageInfo.pkg_version = process.env.npm_package_version ?? "2.x.x";
    }
}
