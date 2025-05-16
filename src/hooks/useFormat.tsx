const useFormat = (num: number | string): string => {
    if (typeof(num) === 'string') {
          return JSON.parse(num).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
    }else{
        return num.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

};

export default useFormat