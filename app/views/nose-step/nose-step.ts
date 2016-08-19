export function loaded(args: any) {
    var autoComplete = args.object.getViewById("aromas");
    autoComplete.android.setHint("Ajouter un arôme");
    autoComplete.android.setHintTextColor(android.graphics.Color.parseColor("#727272"));
    autoComplete.android.setTextSize(16);
}