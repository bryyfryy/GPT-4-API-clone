{ pkgs }: {
	deps = [
		pkgs.killall
  pkgs.nodejs-18_x
    pkgs.nodePackages.typescript-language-server
    pkgs.yarn
    pkgs.replitPackages.jest
    pkgs.chromium
		pkgs.xorg.xorgserver
	];
}