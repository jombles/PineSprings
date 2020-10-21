export default class DialogTree {
    constructor(dialog, npc, priority) {
        this.dialog = dialog;
        console.log(this.dialog);
        for (var i = 0, len = this.dialog.length; i < len; i++){
            var arr = this.dialog[i];
            console.log(len);
            console.log(i);
            console.log(i < len);
            console.log(this.dialog);
            console.log(len == this.dialog.length);
            for (var j = 0, len2 = arr.length; j < len2; j++){
                var str = arr[j];
                this.dialog[i][j] = this.recurseNewLines(str);
            }
        }
        this.activeLine = this.dialog[0];
        this.index = 0;
        this.npc = npc;
        this.priority = priority;
        this.complete;
    }

    recurseNewLines(str){
        if(str.length < 60){
            return str;
        }
        for (var l = 59, len3 = str.length; l < len3; l++){
            if(str[l] == ' '){
                var newStr = str.substring(0, l) + '\n' + this.recurseNewLines(str.substring(l+1));
                console.log(newStr);
                return newStr;
            }
        }
    }

    currentLine(){
        return this.activeLine;
    }

    nextLine(){
        this.index++;
        if(this.dialog[this.index]){
            this.activeLine = this.dialog[this.index];
        } else {
            this.activeLine = false;
            this.complete = true;
        }
    }

    getAndProgress(){
        var d = this.activeLine;
        if(d == false){
            return d;
        } else {
            this.nextLine();
            return d;
        }
    }

}